import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import NavBarElem from "../Components/NavBarElem/NavBarElem";
import "@testing-library/jest-dom/extend-expect";

describe("NavBarElem Tests", () => {
  it("should render NavBarElem", () => {
    render(
      <NavBarElem
        title="Test title"
        classes={{ appBar: {}, appBarShift: {}, menuButton: {}, hide: {} }}
        handleDrawerOpen={() => console.log("Hello")}
        open={true}
      ></NavBarElem>
    );

    const title = screen.getByText("Test title");
    expect(title).toBeInTheDocument();
    // screen.debug();
  });
});
