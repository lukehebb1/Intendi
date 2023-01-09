import { render, screen } from '@testing-library/react';
import CreateModule from '../components/CreateModule';
import { shallow } from "enzyme";

it("CreateModule.js renders without crashing", () => {
  shallow(<CreateModule/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<CreateModule/>);
  expect(wrapper.state('moduleCde')).toEqual(undefined);
  expect(wrapper.state('modulePass')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<CreateModule/>);
  expect(wrapper).toMatchSnapshot();
});