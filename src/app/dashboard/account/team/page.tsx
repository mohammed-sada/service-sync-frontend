'use client'

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import dayjs from 'dayjs';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CircularProgress, IconButton, Snackbar, SnackbarCloseReason, Button } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import React, { useEffect, useState } from 'react';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useAuth } from 'src/contexts/AuthContext';
import { getTeamById, updateTeamInfo } from 'src/api/team';

export default function TeamInfoView() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const teamId = user!.teamId!;

    const openSnackbar = () => setOpen(true);
    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const TeamSchema = Yup.object().shape({
        name: Yup.string().required('Team name is required'),
        dailyBreaks: Yup.array().of(
            Yup.object().shape({
                start_hour: Yup.date().typeError('Start hour is required').required('Start hour is required'),
                end_hour: Yup.date().typeError('End hour is required').required('End hour is required'),
            })
        ),
    });

    const defaultValues = {
        name: '',
        dailyBreaks: [{ start_hour: null, end_hour: null }],
    };

    const methods = useForm({
        resolver: yupResolver(TeamSchema),
        defaultValues,
    });

    const { control, handleSubmit, reset, formState } = methods;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'dailyBreaks',
    });

    const { errors, isSubmitting } = formState;

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const teamData = await getTeamById(teamId);
                reset({
                    name: teamData.name || '',
                    dailyBreaks: teamData.dailyBreaks.map((breakItem: any) => ({
                        start_hour: dayjs(`1970-01-01T${breakItem.start_hour}`).toDate(),
                        end_hour: dayjs(`1970-01-01T${breakItem.end_hour}`).toDate(),
                    })) || [{ start_hour: null, end_hour: null }],
                });
            } catch (error) {
                console.error('Error fetching team data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [user?.teamId, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formattedData = {
                ...data,
                dailyBreaks: data.dailyBreaks.map((breakItem) => ({
                    start_hour: dayjs(breakItem.start_hour).format('HH:mm'),
                    end_hour: dayjs(breakItem.end_hour).format('HH:mm'),
                })),
            };
            await updateTeamInfo(teamId, formattedData);
            openSnackbar();
        } catch (error) {
            console.error('Error updating team info:', error);
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Team Information
            </Typography>

            <Box
                rowGap={2.5}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
                <RHFTextField name="name" label="Team Name" />
            </Box>

            <Typography variant="h6" sx={{ mt: 4 }}>
                Daily Breaks
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {fields.map((item, index) => (
                    <Grid container key={item.id} sx={{ mb: 2 }}>
                        <Grid item xs={5}>
                            <Controller
                                name={`dailyBreaks[${index}].start_hour`}
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        {...field}
                                        label="Start Hour"
                                        slotProps={{
                                            textField: {
                                                error: !!errors.dailyBreaks?.[index]?.start_hour,
                                                helperText: errors.dailyBreaks?.[index]?.start_hour?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Controller
                                name={`dailyBreaks[${index}].end_hour`}
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        {...field}
                                        label="End Hour"
                                        slotProps={{
                                            textField: {
                                                error: !!errors.dailyBreaks?.[index]?.end_hour,
                                                helperText: errors.dailyBreaks?.[index]?.end_hour?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={2} display="flex" alignItems="center">
                            <IconButton onClick={() => remove(index)} color="error">
                                <Iconify icon="carbon:trash-can" />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button
                        startIcon={<Iconify icon="carbon:add" />}
                        onClick={() => append({ start_hour: null, end_hour: null })}
                        variant="outlined"
                        color="primary"
                    >
                        Add Daily Break
                    </Button>
                </Grid>
            </Grid>

            <LoadingButton
                sx={{ marginTop: 5 }}
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Save Changes
            </LoadingButton>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="Updated Successfully"
            />
        </FormProvider>
    );
}