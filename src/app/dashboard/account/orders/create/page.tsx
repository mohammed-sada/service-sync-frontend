"use client"

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Alert,
    Box,
    Button,
    Grid,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { CreateOrderDto, OrderPriorityEnum, Service } from 'src/models/Order';
import TechnicianTeam from 'src/models/TechnicianTeam';
import { createOrder, fetchServices, fetchTeams } from 'src/api/orders';
import { useAuth } from 'src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { LoadingButton } from '@mui/lab';

const CreateOrderForm: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [teams, setTeams] = useState<TechnicianTeam[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState<{
        show: boolean;
        message: string;
    } | null>({
        show: false,
        message: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamData, serviceData] = await Promise.all([
                    fetchTeams(),
                    fetchServices(),
                ]);
                setTeams(teamData.results);
                setServices(serviceData.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const { control, handleSubmit, register, formState: { errors, isSubmitting } } = useForm<CreateOrderDto>();

    const normalizeErrorMessage = (error: any) => {
        if (Array.isArray(error.message)) {
            // If message is an array, concatenate all constraints into one string
            return error.message
                .map((err: any) => {
                    return Object.values(err.constraints)[0];
                })[0]
        }
        return error.message || "An unknown error occurred.";
    };

    const onSubmit = async (values: CreateOrderDto) => {
        const total_cost = values.services.reduce((totalCost, serviceId) => {
            const service = services.find(service => service.id === serviceId);
            if (service) {
                totalCost += service.price;
            }
            return totalCost;
        }, 0);

        try {
            const response = await createOrder({ ...values, total_cost, customerId: user!.id });
            if (response.id) {
                router.push(`${paths.eCommerce.account.orders}/${response.id}`);
            }
        } catch (error) {
            const errorMessage = normalizeErrorMessage(error.response.data);
            setError({ message: errorMessage, show: true });

            // show errors
            console.error('Error creating order:', error);
        }
    };
    console.log(error)
    const today = new Date();
    const minDate = today.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:mm
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} p={2}>
            <Typography variant="h5" gutterBottom>
                Create New Order
            </Typography>
            <Grid container spacing={3}>
                {/* Name */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Order Name"
                        {...register('name', { required: 'Name is required' })}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        {...register('description', { required: 'Description is required' })}
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                </Grid>

                {/* Priority */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="priority"
                        control={control}
                        defaultValue={OrderPriorityEnum.MEDIUM}
                        render={({ field }) => (
                            <TextField
                                select
                                label="Priority"
                                fullWidth
                                {...field}
                            >
                                {Object.values(OrderPriorityEnum).map(priority => (
                                    <MenuItem key={priority} value={priority}>
                                        {priority}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Start Date"
                        type="datetime-local"
                        {...register('start_date', { required: 'Start date is required' })}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.start_date}
                        helperText={errors.start_date?.message}
                        inputProps={{ min: minDate }}
                    />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="End Date"
                        type="datetime-local"
                        {...register('end_date', { required: 'End date is required' })}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.end_date}
                        helperText={errors.end_date?.message}
                        inputProps={{ min: minDate }}
                    />
                </Grid>

                {/* Location Address */}
                <Grid item xs={12}>
                    <TextField
                        label="Location Address"
                        {...register('location_address', { required: 'Address is required' })}
                        fullWidth
                        error={!!errors.location_address}
                        helperText={errors.location_address?.message}
                    />
                </Grid>

                {/* Teams */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="teamId"
                        control={control}
                        render={({ field }) => (
                            <TextField select label="Team" fullWidth {...field}>
                                {teams.map(team => (
                                    <MenuItem key={team.id} value={team.id}>
                                        {team.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                {/* Services */}
                <Grid item xs={12}>
                    <Controller
                        name="services"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <TextField
                                select
                                label="Services"
                                fullWidth
                                SelectProps={{ multiple: true }}
                                {...field}
                            >
                                {services.map(service => (
                                    <MenuItem key={service.id} value={service.id}>
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                    <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary">
                        Create Order
                    </LoadingButton>
                </Grid>
            </Grid>
            <Snackbar
                open={error?.show}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert
                    onClose={() => setError(null)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateOrderForm;
