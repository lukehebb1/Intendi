import { render, screen } from '@testing-library/react';
import LoadingScreen from '../components/LoadingScreen';
import { shallow } from "enzyme";

it("LoadingScreen.js renders without crashing", () => {
  shallow(<LoadingScreen/>);
});

it("Snapshot test", () => {
  const wrapper = shallow(<LoadingScreen/>);
  expect(wrapper).toMatchSnapshot();
});
