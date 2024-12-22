import TechnicianTeam from "./TechnicianTeam";
import User from "./User";

export enum OrderStatusEnum {
  TODO = 'to-do',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export default interface Order {
  id: number;
  name: string;
  description: string;
  status: OrderStatusEnum;
  priority: 'High' | 'Medium' | 'Low';
  start_date: string;
  end_date: string;
  total_cost: number;
  location_address: string;
  location_latitude?: number;
  location_longitude?: number;
  teamId: number;
  team: TechnicianTeam;
  customerId: number;
  customer: User;
  orderToService: OrderService[];
  created_by: string;
  createdAt: string;
  modified_by?: string;
  modified_at?: string;
}

interface OrderService {
  id: number;
  service: Service;
  quantity: number;
  price_at_ordering: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface CreateOrderDto {
  name: string;
  description: string;
  priority: OrderPriorityEnum;
  start_date: string;
  end_date: string;
  total_cost: number;
  location_address: string;
  location_latitude?: number;
  location_longitude?: number;
  teamId: number;
  customerId: number;
  services: number[];
}

export enum OrderPriorityEnum {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}