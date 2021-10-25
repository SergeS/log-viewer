
export type LogItem = {
  message: string,
  fullMessage?: string, // If not set, equals message
  timestamp: number,
  tags?: { [key: string]: boolean },
};

export type FetchOptions = {
  [type: string]: {
    label: string, 
    options: {
      [option: string]: {
        placeholder: string,
        validate?: RegExp,
      }
    },
    fetch: (options: {[option: string]: string}) => Promise<LogItem[]>,
  },
};

export type LogViewerOptions = {
  fetchOptions: FetchOptions,
};
