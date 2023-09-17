import { render, fireEvent } from '@testing-library/vue'
import VButton from '@/components/VButton.vue'

test('renders a button with the provided text', () => {
  const buttonText = 'Click Me'
  const { getByText } = render(VButton, {
    props: {
      text: buttonText
    }
  })

  const button = getByText(buttonText)
  expect(button).toBeInTheDocument()
})

test('emits a click event when clicked', async () => {
  const { getByText } = render(VButton)

  const button = getByText('Click Me')
  await fireEvent.click(button)

  expect(button).toHaveBeenTriggered()
})

// Add more test cases for other component behavior and props
