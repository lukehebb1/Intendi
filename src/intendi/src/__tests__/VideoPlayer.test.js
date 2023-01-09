import { render, screen } from '@testing-library/react';
import VideoPlayer from '../components/VideoPlayer';
import { shallow } from "enzyme";

it("VideoPlayer.js renders without crashing", () => {
  shallow(<VideoPlayer/>);
});

it('states should be undefined', () => {
  const wrapper = shallow(<VideoPlayer/>);
  expect(wrapper.state('photo')).toEqual(undefined);
  expect(wrapper.state('photoTime')).toEqual(undefined);
  expect(wrapper.state('StudentSessionKey')).toEqual(undefined);
  expect(wrapper.state('UserBrowser')).toEqual(undefined);
  expect(wrapper.state('watchday')).toEqual(undefined);
  expect(wrapper.state('WatchTime')).toEqual(undefined);
});

it("Snapshot test", () => {
  const wrapper = shallow(<VideoPlayer/>);
  expect(wrapper).toMatchSnapshot();
});
