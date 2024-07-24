import Button from "./components/Button";

const App = () => {
  return (
    <div style={{ display: "flex", columnGap: "1rem" }}>
      <Button variant="solid" color="primary">
        Click Me
      </Button>

      <Button variant="bordered" color="error">
        Click Me
      </Button>

      <Button variant="light" color="secondary">
        Click Me
      </Button>
    </div>
  );
};

export default App;
