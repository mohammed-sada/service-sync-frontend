"use client";

import { LoadingButton } from '@mui/lab';
import {
    Alert,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Snackbar,
    Stack,
    Typography
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus } from 'src/api/orders';
import { useAuth } from 'src/contexts/AuthContext';
import Order, { OrderStatusEnum } from 'src/models/Order';

const OrderDetails = () => {
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean | string>(false);
    const [error, setError] = useState<{
        show: boolean;
        message: string;
    } | null>({
        show: false,
        message: ""
    });

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchOrderDetails = async (orderId: number) => {
            setLoading("fetchOrderDetails");
            setError(null);

            try {
                const response = await getOrderById(orderId);
                setOrder(response.data);
            } catch (err) {
                setError({
                    show: true,
                    message: 'Error fetching order details'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails(Number(id));
        }
    }, [id]);

    async function handleUpdateStatus(orderId: number, status: OrderStatusEnum) {
        setLoading(status);
        try {
            const order = await updateOrderStatus(orderId, status);
            // @ts-ignore
            setOrder(prev => ({ ...prev, status: OrderStatusEnum[order.status.replace("-", "_").toUpperCase() as OrderStatusEnum] }));
            // Optionally refetch the order data or update the state
        } catch (error) {
            setError({
                show: true,
                message: error.response.data.message
            });
            console.error('Error updating order status:', error);
        }
        setLoading(false);
    }

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            {loading === "fetchOrderDetails" && <CircularProgress />}
            {order && (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Order Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Name:</Typography>
                                <Typography>{order.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Description:</Typography>
                                <Typography>{order.description}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Status:</Typography>
                                <Typography>{order.status}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Priority:</Typography>
                                <Typography>{order.priority}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Start Date:</Typography>
                                <Typography>{new Date(order.start_date).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">End Date:</Typography>
                                <Typography>{new Date(order.end_date).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Total Cost:</Typography>
                                <Typography>${order.total_cost}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Location Address:</Typography>
                                <Typography>{order.location_address}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Customer:</Typography>
                                <Typography>{order.customer?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Technician Team:</Typography>
                                <Typography>{order.team?.name}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Services:</Typography>
                                <ul>
                                    {order.orderToService.map((s) => (
                                        <li key={s.id}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography>{s.service.name}</Typography>
                                                <Typography>{s.price_at_ordering}$</Typography>
                                            </Stack>
                                        </li>
                                    ))}
                                </ul>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="flex-end" sx={{ marginTop: 2 }}>
                            <Grid item>
                                {user && user.role.id === 2 ? (
                                    order.status === OrderStatusEnum.CANCELLED ? (
                                        <Typography variant="body2" color="error">
                                            This order has been cancelled.
                                        </Typography>
                                    ) : (
                                        <LoadingButton
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleUpdateStatus(order.id, OrderStatusEnum.CANCELLED)}
                                            loading={loading === OrderStatusEnum.CANCELLED}
                                            disabled={!!loading}
                                        >
                                            Cancel Order
                                        </LoadingButton>
                                    )
                                ) : (
                                    <>
                                        {order.status === OrderStatusEnum.TODO && (
                                            <LoadingButton
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleUpdateStatus(order.id, OrderStatusEnum.IN_PROGRESS)}
                                                loading={loading === OrderStatusEnum.IN_PROGRESS}
                                                disabled={!!loading}
                                            >
                                                Mark as In-Progress
                                            </LoadingButton>
                                        )}
                                        {order.status === OrderStatusEnum.IN_PROGRESS && (
                                            <LoadingButton
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleUpdateStatus(order.id, OrderStatusEnum.DONE)}
                                                loading={loading === OrderStatusEnum.DONE}
                                                disabled={!!loading}
                                            >
                                                Mark as Done
                                            </LoadingButton>
                                        )}
                                        {order.status === OrderStatusEnum.CANCELLED && (
                                            <Typography variant="body2" color="error">
                                                This order has been cancelled.
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>
            )}
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
        </Container>
    );
};

export default OrderDetails;
