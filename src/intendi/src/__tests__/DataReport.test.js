import { render, screen } from '@testing-library/react';
import DataReport from '../components/DataReport';
import { shallow } from "enzyme";

it("DataReport.js renders without crashing", () => {
  shallow(<DataReport/>);
});

it('states should be correct', () => {
  const wrapper = shallow(<DataReport/>);
  expect(wrapper.state('videoLength')).toEqual(0);
  expect(wrapper.state('focused')).toEqual(true);
  expect(wrapper.state('photo')).toEqual(null);
});

it("Snapshot test", () => {
  const wrapper = shallow(<DataReport/>);
  expect(wrapper).toMatchSnapshot();
});
