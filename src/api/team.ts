import TechnicianTeam, { UpdateTechnicianTeamDto } from 'src/models/TechnicianTeam';
import axios, { AxiosResponse } from '../utils/axios';
import { endpoints } from './endpoints';

export const updateTeamInfo = async (id: number, data: UpdateTechnicianTeamDto) => {
    const response = await axios.patch(`${endpoints.technicianTeams}/${id}`, data);
    return response.data;
};

export const getTeamById = async (id: number) => {
    const response = await axios.get<TechnicianTeam>(`${endpoints.technicianTeams}/${id}`);
    return response.data;
};