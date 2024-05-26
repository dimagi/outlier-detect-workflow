import { useFormContext, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    ccHqUrl: z.string().min(1, "CommCare HQ URL is required"),
    ccUser: z.string().min(1, "Username is required"),
    ccApiKey: z.string().min(1, "API Key is required"),
});

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
