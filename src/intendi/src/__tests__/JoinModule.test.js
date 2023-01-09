import { render, screen } from '@testing-library/react';
import JoinModule from '../components/JoinModule';
import { shallow } from "enzyme";

it("JoinModule.js renders without crashing", () => {
  shallow(<JoinModule/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<JoinModule/>);
  expect(wrapper.state('moduleCde')).toEqual(undefined);
  expect(wrapper.state('modulePass')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<JoinModule/>);
  expect(wrapper).toMatchSnapshot();
});
