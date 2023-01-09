import { render, screen } from '@testing-library/react';
import About from '../components/About';
import { shallow } from "enzyme";

it("About.js renders without crashing", () => {
  shallow(<About/>);
});

it("includes two paragraphs", () => {
  const wrapper = shallow(<About/>);
  expect(wrapper.find("p").length).toEqual(2);
});

it("Snapshot test", () => {
  const wrapper = shallow(<About/>);
  expect(wrapper).toMatchSnapshot();
});