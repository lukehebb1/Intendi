import { render, screen } from '@testing-library/react';
import StudentNavBar from '../components/StudentNavBar';
import { shallow } from "enzyme";

it("StudentNavBar.js renders without crashing", () => {
  shallow(<StudentNavBar/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<StudentNavBar/>);
  expect(wrapper.state('moduleLst')).toEqual(undefined);
  expect(wrapper.state('SelectedModule')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<StudentNavBar/>);
  expect(wrapper).toMatchSnapshot();
});