import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import "../assets/themes/dark.css";
import "../assets/themes/light.css";
import "../assets/toolbar.css";

const ReactScheduler = () => {
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);

  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfYear());
  const [days, setDays] = useState(DayPilot.Date.today().daysInYear());
  const [theme, setTheme] = useState("light");

  const themes = [
    { name: "light", text: "Light" },
    { name: "dark", text: "Dark" }
  ];

  const colors = [
    { name: "(default)", id: null },
    { name: "Blue",    id: "#6fa8dc" },
    { name: "Green",   id: "#93c47d" },
    { name: "Yellow",  id: "#ffd966" },
    { name: "Red",     id: "#f6b26b" }
  ];

  const editEvent = async (e) => {
    const form = [
      { name: "Text", id: "text" },
      { name: "Start", id: "start", type: "datetime", disabled: true },
      { name: "End", id: "end", type: "datetime", disabled: true },
      { name: "Resource", id: "resource", type: "select", options: resources },
      { name: "Color", id: "backColor", type: "select", options: colors }
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }

    scheduler.events.update(modal.result);
  };

  const onTimeRangeSelected = async (args) => {
    const scheduler = args.control;
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    scheduler.clearSelection();
    if (modal.canceled) {
      return;
    }
    scheduler.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      resource: args.resource,
      text: modal.result
    });
  };

  const onBeforeEventRender = (args) => {
    args.data.borderColor = "darker";
    // add edit icon to the event
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
        onClick: async (args) => {
          await editEvent(args.source);
        }
      }
    ];
  };

  useEffect(() => {

    const firstDayOfMonth = DayPilot.Date.today().firstDayOfMonth();

    const events = [
      {
        id: 1,
        text: "Event 1",
        start: firstDayOfMonth.addDays(1),
        end: firstDayOfMonth.addDays(6),
        resource: "R2",
      }
    ];
    setEvents(events);

    const resources = [
      { name: "Resource 1", id: "R1"},
      { name: "Resource 2", id: "R2"},
      { name: "Resource 3", id: "R3"},
      { name: "Resource 4", id: "R4"},
      { name: "Resource 5", id: "R5"},
      { name: "Resource 6", id: "R6"},
      { name: "Resource 7", id: "R7"},
      { name: "Resource 8", id: "R8"},
      { name: "Resource 9", id: "R9"},
    ];
    setResources(resources);

    scheduler?.scrollTo(DayPilot.Date.today().firstDayOfMonth());

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
          {groupBy: "Month"},
          {groupBy: "Day", format: "d"}
        ]}
        startDate={startDate}
        days={days}
        cellWidth={60}
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
}
export default ReactScheduler;
