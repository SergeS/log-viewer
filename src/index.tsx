
import React, { useCallback, useState } from 'react';
import { render } from 'react-dom';
import { Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css'

import { LogItem, LogViewerOptions } from './types';
import { deleteDatabase, open } from './indexeddb'
import SourceSelect from './SourceSelect';

const DataViews = () => {
  return <div />
}

const LogViewer = ({ fetchOptions } : LogViewerOptions) => {
  const [isLoading, setLoading] = useState(false);
  const [loadTs, setLoadTs] = useState(Date.now());

  const loadData = useCallback(async (dataPromise: Promise<LogItem[]>) => {
    setLoading(true);

    await deleteDatabase('log-viewer');

    const data = await dataPromise;
    const tags = Object.keys(data.reduce((out, item) => {
      return Object.assign(out, item.tags ?? {})
    }, {} as { [key: string]: boolean }));

    const db = await open('log-viewer', 1, (db) => {
      const items = db.createObjectStore('items', { autoIncrement: true });

      items.createIndex('time', 'time', { unique: false });

      tags.forEach((tag) => {
        items.createIndex(`tag-${tag}`, ['tags', tag], { unique: false })
      })
    });

    const store = db.transaction('items', 'readwrite').objectStore('items');
    data.forEach((logItem) => {
      store.put(logItem)
    })

    setLoading(false);
    setLoadTs(Date.now());
  }, []);

  return (
    <Container>
      <h3>Log viewer</h3>
      <SourceSelect fetchOptions={fetchOptions} loadData={loadData} />

      {isLoading && <div>Loading ...</div>}

      <DataViews key={loadTs} />
    </Container>
  )
}

const startLogViewer = (container: HTMLElement, options: LogViewerOptions) => {
  render(<LogViewer {...options} />, container);
}

declare global {
  interface Window {
    startLogViewer: typeof startLogViewer
  }
}

window.startLogViewer = startLogViewer;

export default startLogViewer;
