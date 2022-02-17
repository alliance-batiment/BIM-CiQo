import * as reactModule from "react";
import {
  render,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import {
  screen
} from '@testing-library/dom';
import {
  renderHook,
  act
} from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PortalList from "../Components/PortalList/PortalList";

const mockedPortalList = [
  {
    portal_id: 121,
    portal_name: "MydatBIM AURA",
    portal_url: "https://aura.mydatbim.com/",
    updated_at: "2019-02-08T08:42:44+01:00",
  },
  {
    portal_id: 122,
    portal_name: "La Box Bois de Vivier Massif Central",
    portal_url: "https://boxboisbim.mydatbim.com",
    updated_at: "2019-02-08T08:43:47+01:00",
  },
  {
    portal_id: 123,
    portal_name: "MydatBIM KROQI",
    portal_url: "https://kroqi.mydatbim.com",
    updated_at: "2019-02-08T08:44:38+01:00",
  },
];

// const server = setupServer(
//   // On précise ici l'url qu'il faudra "intercepter"
//   rest.get(`${process.env.REACT_APP_API_DATBIM}/portals`, (req, res, ctx) => {
//     // Là on va pouvoir passer les datas mockées dans ce qui est retourné en json
//     return res(ctx.json({
//       data: mockedPortalList
//     }))
//   })
// )

// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

describe('PortalList', () => {
  test('Should render without crash', async () => {
    const mockHandleNext = jest.fn();
    const mockSetActiveStep = jest.fn();
    render(<PortalList
      handleNext={mockHandleNext}
      setActiveStep={mockSetActiveStep}
    />);
    // expect(screen.getByText("MydatBIM AURA")).toBeNull();
  })
})