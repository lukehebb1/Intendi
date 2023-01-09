import { render, screen } from '@testing-library/react';
import ModulePage from '../components/ModulePage';
import { shallow } from "enzyme";

it("ModulePage.js renders without crashing", () => {
  shallow(<ModulePage/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<ModulePage/>);
  expect(wrapper.state('Week')).toEqual(undefined);
  expect(wrapper.state('VideoList')).toEqual(undefined);
  expect(wrapper.state('data')).toEqual(undefined);
  expect(wrapper.state('videoTitle')).toEqual(undefined);
  expect(wrapper.state('description')).toEqual(undefined);
  expect(wrapper.state('videoID')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<ModulePage/>);
  expect(wrapper).toMatchSnapshot();
});
