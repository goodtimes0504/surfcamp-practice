'use server'
import { z } from 'zod'
import { subscribeService } from './services'

const subscribeSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
})

export async function subscribeAction(prevState: any, formData: FormData) {
  console.log('Our first server action')
  const email = formData.get('email')
  const validatedFields = subscribeSchema.safeParse({ email })
  if (!validatedFields.success) {
    return {
      ...prevState,
      zodError: validatedFields.error.flatten().fieldErrors,
      strapiError: null,
    }
  }

  const responseData = await subscribeService(validatedFields.data.email)
  if (!responseData) {
    return {
      ...prevState,
      strapiError: null,
      zodErrors: null,
      errorMessage: 'Something went wrong,请重试',
    }
  }
  if (responseData.error) {
    return {
      ...prevState,
      strapiError: responseData.error,
      zodErrors: null,
      errorMessage: '订阅失败',
    }
  }

  return {
    ...prevState,
    strapiError: null,
    zodErrors: null,
    errorMessage: null,
    successMessage: '订阅成功',
  }
}
