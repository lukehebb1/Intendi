import { render, screen } from '@testing-library/react';
import MySignIn from '../components/MySignIn';
import { shallow } from "enzyme";

it("MySignIn.js renders without crashing", () => {
  shallow(<MySignIn/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<MySignIn/>);
  expect(wrapper.state('email')).toEqual("");
  expect(wrapper.state('password')).toEqual("");
  expect(wrapper.state('passwordconfirm')).toEqual("");
  expect(wrapper.state('code')).toEqual("");
  expect(wrapper.state('passwordMatchMessage')).toEqual("");
});

it("Snapshot test", () => {
  const wrapper = shallow(<MySignIn/>);
  expect(wrapper).toMatchSnapshot();
});
