import { useFormContext, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function CCHQCredentials() {
    const { control } = useFormContext();

    return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>CommCare HQ Credentials</CardTitle>
            <CardDescription>Enter your CommCare HQ credentials.</CardDescription>
          </CardHeader>
          <CardContent>
                <FormField
                    control={control}
                    name="ccHqUrl"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>CommCare HQ URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>Enter the URL of your CommCare HQ instance.</FormDescription>
                            <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <div className="flex space-x-4">
                    <FormField
                        control={control}
                        name="ccUser"
                        render={({ field, fieldState }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>Enter your username for CommCare HQ.</FormDescription>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="ccApiKey"
                        render={({ field, fieldState }) => (
                            <FormItem className="flex-1">
                                <FormLabel>API Key</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>Enter your API key for CommCare HQ.</FormDescription>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                </div>
          </CardContent>
        </Card>
    );
}
