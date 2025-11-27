import { Form } from "@remix-run/react";

export const FigmaInputForm = () => {
  return (
    <>
      <h2>Insert a Figma Access Token and File key or click Try Demo</h2>

      <Form method="post">
        <div className="form-container">
          <input
            name="token"
            type="password"
            placeholder="Figma Access Token"
            required
          />
          <input name="fileKey" placeholder="Figma File Key" required />
          <button type="submit">Generate HTML</button>
        </div>
      </Form>
      <p>or</p>
      <Form method="post" className="demo-form">
        <input name="token" value="demo" type="hidden" />
        <input name="fileKey" value="demo" type="hidden" />
        <button type="submit" className="demo-button">
          Try Demo
        </button>
      </Form>
    </>
  );
};
