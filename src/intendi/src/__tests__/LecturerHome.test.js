import { render, screen } from '@testing-library/react';
import LecturerHome from '../components/LecturerHome';
import { shallow } from "enzyme";

it("LecturerHome.js renders without crashing", () => {
  shallow(<LecturerHome/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<LecturerHome/>);
  expect(wrapper.state('SelectedModule')).toEqual(undefined);
  expect(wrapper.state('photo')).toEqual(undefined);
  expect(wrapper.state('ModulePageLoad')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<LecturerHome/>);
  expect(wrapper).toMatchSnapshot();
});
