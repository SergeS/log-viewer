import React, { useState, useCallback, FormEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

import { FetchOptions, LogItem } from './types';

type SourceSelectProps = {
  fetchOptions: FetchOptions,
  loadData: (data: Promise<LogItem[]>) => void,
};

const SourceSelect = ({ fetchOptions, loadData }: SourceSelectProps) => {
  const sources = Object.keys(fetchOptions);
  const [selectedSource, setSource] = useState(sources[0]);
  const { options, fetch } = fetchOptions[selectedSource];
  const optionKeys = Object.keys(options);

  const onFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements as any as { [key: string]: HTMLInputElement };

    const parameters = optionKeys.reduce((out, key) => {
      return { ...out, [key]: (elements[key] as HTMLInputElement).value };
    }, {} as { [key: string]: string })

    loadData(fetchOptions[selectedSource].fetch(parameters))
  }, [fetchOptions, loadData, selectedSource]);

  return (
    <form onSubmit={onFormSubmit}>
      <Row>
        <Col sm="3" xs="4">
          <Form.Group controlId="sourceSelect">
            <Form.Select name="sourceSelect" value={selectedSource} onChange={(event) => setSource((event.target as HTMLSelectElement).value)}>
              {sources.map((source) => (
                <option value={source} key={source}>{fetchOptions[source].label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        {optionKeys.map((option) => (
          <Col sm="3" xs="4" key={option}>
            <Form.Group controlId={option}>
              <Form.Control placeholder={options[option].placeholder} name={option} />
            </Form.Group>
          </Col>
        ))}
        <Col sm="3" xs="4">
          <Button type="submit" variant="primary" style={{ display: 'block' }}>Load data</Button>
        </Col>
      </Row>
    </form>
  )
}

export default SourceSelect;