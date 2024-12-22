import Order from "./Order";
import User from "./User";

export default interface TechnicianTeam {
  id: string;
  name: string;
  busyTimes: Array<{
    start_date: string;
    end_date: string;
    order_id: string;
  }>;
  dailyBreaks: Array<{
    start_hour: string;
    end_hour: string;
  }>;
  orders: Order[];
  technicians: User[];
}

export interface UpdateTechnicianTeamDto {
  name?: string;
  dailyBreaks?: Array<{
    start_hour: string;
    end_hour: string;
  }>;
}
