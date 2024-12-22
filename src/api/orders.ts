import axios, { AxiosResponse } from '../utils/axios';
import Order, { CreateOrderDto, OrderStatusEnum } from 'src/models/Order';
import { endpoints } from './endpoints';
import { PaginatedResponse } from 'src/models';

export const fetchOrders = ({
  keywords,
  limit,
  page
}: {
  keywords?: string;
  limit?: number;
  page?: number;
} = {}): Promise<AxiosResponse<PaginatedResponse<Order>>> => {

  const params: Record<string, any> = {};

  if (keywords) {
    params.keywords = keywords;
  }
  if (limit !== undefined) {
    params.limit = limit;
  }
  if (page !== undefined) {
    params.page = page;
  }

  return axios.get<PaginatedResponse<Order>>(endpoints.orders, {
    params
  });
};

export const getOrderById = (id: number): Promise<AxiosResponse<Order>> => {
  return axios.get<Order>(`${endpoints.orders}/${id}`);
};

export const createOrder = async (data: CreateOrderDto) => {
  const response = await axios.post(endpoints.orders, data);
  return response.data;
};

export const fetchTeams = async () => {
  const response = await axios.get(endpoints.technicianTeams);
  return response.data;
};

export const fetchServices = async () => {
  const response = await axios.get(endpoints.services);
  return response.data;
};

export async function updateOrderStatus(orderId: number, status: OrderStatusEnum) {
  const response = await axios.patch(`/orders/${orderId}/status/${status}`);
  return response.data;
}