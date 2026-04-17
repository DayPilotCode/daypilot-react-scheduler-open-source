import { useEffect, useState } from 'react';
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import "../assets/themes/dark.css";
import "../assets/themes/light.css";
import "../assets/toolbar.css";

const themes = [
  { name: "light", text: "Light" },
  { name: "dark", text: "Dark" }
];

const colors = [
  { name: "(default)", id: null },
  { name: "Blue", id: "#6fa8dc" },
  { name: "Green", id: "#93c47d" },
  { name: "Yellow", id: "#ffd966" },
  { name: "Red", id: "#f6b26b" }
];

const ReactScheduler = () => {
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [startDate] = useState(DayPilot.Date.today().firstDayOfYear());
  const [days] = useState(DayPilot.Date.today().daysInYear());
  const [theme, setTheme] = useState("light");

  const eventEditForm = [
    { name: "Text", id: "text" },
    { name: "Start", id: "start", type: "datetime", disabled: true },
    { name: "End", id: "end", type: "datetime", disabled: true },
    { name: "Resource", id: "resource", type: "select", options: resources },
    { name: "Color", id: "backColor", type: "select", options: colors }
  ];

  const editEvent = async (eventData) => {
    const modal = await DayPilot.Modal.form(eventEditForm, eventData);
    if (modal.canceled) {
      return;
    }

    setEvents((current) => current.map((item) => {
      if (item.id !== modal.result.id) {
        return item;
      }
      return { ...item, ...modal.result };
    }));
  };

  const onTimeRangeSelected = async (args) => {
    const data = {
      start: args.start,
      end: args.end,
      resource: args.resource,
      id: DayPilot.guid(),
      text: "Event"
    };

    const modal = await DayPilot.Modal.form(eventEditForm, data);

    args.control.clearSelection();

    if (modal.canceled) {
      return;
    }

    setEvents((current) => current.concat(modal.result));
  };

  const onBeforeEventRender = (args) => {
    if (!args.data.backColor) {
      args.data.backColor = "#93c47d";
      args.data.fontColor = "#ffffff";
    }

    args.data.borderColor = "darker";
    args.data.areas = [
      {
        right: 5,
        top: "calc(50% - 15px)",
        width: 30,
        height: 30,
        symbol: "/icons/daypilot.svg#edit",
        borderRadius: "50%",
        backColor: "#ffffff99",
        fontColor: "#999999",
        padding: 5,
        onClick: async () => {
          await editEvent(args.source.data);
        }
      }
    ];
  };

  useEffect(() => {
    const loadResources = async () => {
      const resources = [
        { name: "Resource 1", id: "R1" },
        { name: "Resource 2", id: "R2" },
        { name: "Resource 3", id: "R3" },
        { name: "Resource 4", id: "R4" },
        { name: "Resource 5", id: "R5" },
        { name: "Resource 6", id: "R6" },
        { name: "Resource 7", id: "R7" },
        { name: "Resource 8", id: "R8" },
        { name: "Resource 9", id: "R9" }
      ];
      setResources(resources);
    };

    loadResources();
  }, []);

  useEffect(() => {
    const firstDayOfMonth = DayPilot.Date.today().firstDayOfMonth();

    const loadEvents = async () => {
      const events = [
        {
          id: 1,
          text: "Event 1",
          start: firstDayOfMonth.addDays(1),
          end: firstDayOfMonth.addDays(5),
          resource: "R1",
          backColor: "#93c47d"
        },
        {
          id: 2,
          text: "Event 2",
          start: firstDayOfMonth.addDays(2),
          end: firstDayOfMonth.addDays(7),
          resource: "R3",
          backColor: "#6fa8dc"
        },
        {
          id: 3,
          text: "Event 3",
          start: firstDayOfMonth.addDays(6),
          end: firstDayOfMonth.addDays(11),
          resource: "R1",
          backColor: "#ffd966"
        },
        {
          id: 4,
          text: "Event 4",
          start: firstDayOfMonth.addDays(8),
          end: firstDayOfMonth.addDays(11),
          resource: "R3",
          backColor: "#f6b26b"
        },
        {
          id: 5,
          text: "Event 5",
          start: firstDayOfMonth.addDays(4),
          end: firstDayOfMonth.addDays(9),
          resource: "R5",
          backColor: "#cccccc"
        }
      ];
      setEvents(events);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (!scheduler) {
      return;
    }

    scheduler.scrollTo(DayPilot.Date.today().firstDayOfMonth());
  }, [scheduler]);

  return (
    <div>
      <div className="toolbar">
        <label htmlFor="theme">Theme:</label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
          }}
        >
          {themes.map((t) => (
            <option key={t.name} value={t.name}>
              {t.text}
            </option>
          ))}
        </select>
      </div>

      <DayPilotScheduler
        scale={"Day"}
        timeHeaders={[
          { groupBy: "Month" },
          { groupBy: "Day", format: "d" }
        ]}
        startDate={startDate}
        days={days}
        cellWidth={60}
        rowHeaderWidth={110}
        rowMarginTop={2}
        rowMarginBottom={2}
        eventHeight={40}
        events={events}
        resources={resources}
        onBeforeEventRender={onBeforeEventRender}
        onTimeRangeSelected={onTimeRangeSelected}
        controlRef={setScheduler}
        theme={theme}
      />
    </div>
  );
};

export default ReactScheduler;
