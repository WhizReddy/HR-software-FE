import * as React from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'

import { cn } from '@/lib/utils'
import { Toggle, toggleVariants } from '@/Components/ui/toggle'

type ToggleGroupType = 'single' | 'multiple'

type ToggleGroupValue = string | string[]

type ToggleGroupContextValue = {
  values: string[]
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  values: [],
})

type ToggleGroupProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive>,
  'multiple' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  type?: ToggleGroupType
  value?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
  onValueChange?: (value: any) => void
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      type = 'multiple',
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const multiple = type === 'multiple'

    const controlledValue =
      value === undefined ? undefined : Array.isArray(value) ? value : value ? [value] : []

    const defaultGroupValue =
      defaultValue === undefined
        ? undefined
        : Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue
            ? [defaultValue]
            : []

    const [internalValue, setInternalValue] = React.useState<string[]>(
      defaultGroupValue ?? [],
    )

    const values = controlledValue ?? internalValue

    return (
      <ToggleGroupContext.Provider value={{ values }}>
        <ToggleGroupPrimitive
          ref={ref}
          multiple={multiple}
          value={controlledValue}
          defaultValue={defaultGroupValue}
          onValueChange={(groupValue) => {
            setInternalValue(groupValue)

            if (!onValueChange) return

            if (multiple) {
              onValueChange(groupValue)
            } else {
              onValueChange(groupValue[0] ?? '')
            }
          }}
          className={cn('flex items-center justify-center gap-1', className)}
          {...props}
        />
      </ToggleGroupContext.Provider>
    )
  },
)

ToggleGroup.displayName = 'ToggleGroup'

type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof Toggle> & {
  value: string
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, value, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    const isOn = context.values.includes(value)

    return (
      <Toggle
        ref={ref}
        value={value}
        data-state={isOn ? 'on' : 'off'}
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Toggle>
    )
  },
)

ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
