import { render, screen } from '@testing-library/react';
import StudentHome from '../components/StudentHome';
import { shallow } from "enzyme";

it("StudentHome.js renders without crashing", () => {
  shallow(<StudentHome/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<StudentHome/>);
  expect(wrapper.state('SelectedModule')).toEqual(undefined);
  expect(wrapper.state('moduleLst')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<StudentHome/>);
  expect(wrapper).toMatchSnapshot();
});
