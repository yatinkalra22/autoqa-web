import { HOW_IT_WORKS_STEPS } from '@/mocks/howItWorksSteps'

export function HowItWorks() {
  return (
    <div className="mt-16">
      <h2 className="text-center text-sm font-medium text-gray-500 tracking-wider uppercase mb-6">
        How it works
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <div
            key={step.title}
            className="relative bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
          >
            {i < HOW_IT_WORKS_STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-2 w-4 text-gray-700 -translate-y-1/2 z-10">
                &rarr;
              </div>
            )}
            <div className={`w-10 h-10 rounded-lg border ${step.color} flex items-center justify-center mx-auto mb-3`}>
              <step.icon className="w-5 h-5" />
            </div>
            <p className="text-white text-sm font-medium mb-1">{step.title}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
