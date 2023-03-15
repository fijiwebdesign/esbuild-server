// only include env vars prefixed REACT_ or NODE_
export const getSafeEnv = () => Object.entries(process.env)
  .reduce((prev, [key, value]) => (key.indexOf('REACT_') === 0 || key.indexOf('NODE_') === 0 ? {
    ...prev,
    [key]: value
  } : prev), {})