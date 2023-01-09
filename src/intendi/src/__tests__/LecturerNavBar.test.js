import { render, screen } from '@testing-library/react';
import LecturerNavBar from '../components/LecturerNavBar';
import { shallow } from "enzyme";

it("LecturerNavBar.js renders without crashing", () => {
  shallow(<LecturerNavBar/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<LecturerNavBar/>);
  expect(wrapper.state('SelectedModule')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<LecturerNavBar/>);
  expect(wrapper).toMatchSnapshot();
});