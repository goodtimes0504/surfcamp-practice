'use client'
import type { SubscribeProps } from '@/types'
import { subscribeAction } from '@/data/actions'
import { useActionState } from 'react'

const INITIAL_STATE = {
  zodError: null,
  strapiError: null,
  errorMessage: null,
  successMessage: null,
}

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(subscribeAction, INITIAL_STATE)
  const zodErrors = formState.zodError?.email
  const strapiErrors = formState.strapiError?.errors?.message
  const errorMessage = strapiErrors || zodErrors || formState.errorMessage
  const successMessage = formState.successMessage
  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <input
          name="email"
          type="email"
          placeholder={errorMessage || successMessage || placeholder}
          className={`newsletter__email ${
            errorMessage ? 'newsletter__email--error' : ''
          }`}
        />
        <button
          type="submit"
          className="newsletter__subscribe btn btn--turquoise btn--medium"
        >
          {buttonText}
        </button>
      </form>
    </section>
  )
}
