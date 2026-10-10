import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";

const ReactScheduler = () => {
  const config = {
    timeHeaders: [ 
      { groupBy: "Month" },
      { groupBy: "Day", format: "d" }
    ],
    scale: "Day",
    days: DayPilot.Date.today().daysInMonth(),
    startDate: DayPilot.Date.today().firstDayOfMonth(),
  };

  return (
    <div>
      <DayPilotScheduler {...config} />
    </div>
  );
};

export default ReactScheduler;
