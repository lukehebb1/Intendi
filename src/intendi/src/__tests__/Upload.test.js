import { render, screen } from '@testing-library/react';
import Upload from '../components/Upload';
import { shallow } from "enzyme";

it("Upload.js renders without crashing", () => {
  shallow(<Upload/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<Upload/>);
  expect(wrapper.state('imageName')).toEqual(undefined);
  expect(wrapper.state('imageFile')).toEqual(undefined);
  expect(wrapper.state('response')).toEqual(undefined);
  expect(wrapper.state('moduleCde')).toEqual(undefined);
  expect(wrapper.state('week')).toEqual(undefined);
  expect(wrapper.state('title')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<Upload/>);
  expect(wrapper).toMatchSnapshot();
});