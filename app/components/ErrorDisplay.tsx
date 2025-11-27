interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="error-container">
      <h3>Error:</h3>
      <p>{error}</p>
    </div>
  );
};
