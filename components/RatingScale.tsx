'use client';

import { RatingOption } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RatingScaleProps {
  title: string;
  question: string;
  options: RatingOption[];
  value: number | null;
  onChange: (value: number) => void;
  name: string;
}

export function RatingScale({
  title,
  question,
  options,
  value,
  onChange,
  name,
}: RatingScaleProps) {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{question}</p>
      </div>

      <RadioGroup
        value={value?.toString()}
        onValueChange={(val) => onChange(Number(val))}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-start space-x-3 p-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RadioGroupItem value={option.value.toString()} id={`${name}-${option.value}`} className="mt-0.5" />
            <div className="flex-1">
              <Label
                htmlFor={`${name}-${option.value}`}
                className="font-medium text-gray-900 cursor-pointer flex items-center gap-2"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                  {option.value}
                </span>
                {option.label}
              </Label>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
