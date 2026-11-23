import type { Question } from '../types/quiz'

export const SECTIONS = {
  A: 'Your Presence',
  B: 'Your Spirit',
  C: 'Your Limits',
  D: 'Your Night',
} as const

// Q1 to Q6 decide the identity. A = Velvet Enigma, B = Arcane Wanderer, C = Crimson Phantom, D = Neon Revenant.
// Q7 to Q12 only filter and rank costumes.
export const QUESTIONS: Question[] = [
  {
    number: 1, key: 'q1', section: 'A', kind: 'single',
    prompt: 'You step into a candlelit room. What do people notice first?',
    options: [
      { value: 'A', label: 'The quiet confidence of how I move' },
      { value: 'B', label: 'The strange symbols I carry' },
      { value: 'C', label: 'The danger in my smile' },
      { value: 'D', label: 'The glow that follows me' },
    ],
  },
  {
    number: 2, key: 'q2', section: 'A', kind: 'single',
    prompt: 'Which setting feels most like home?',
    options: [
      { value: 'A', label: 'A velvet-draped salon after midnight' },
      { value: 'B', label: 'A forest library of forgotten books' },
      { value: 'C', label: 'A crumbling chapel lit by red candles' },
      { value: 'D', label: 'A rain-soaked city of humming lights' },
    ],
  },
  {
    number: 3, key: 'q3', section: 'A', kind: 'single',
    prompt: 'Pick the material you would wear every day.',
    options: [
      { value: 'A', label: 'Black silk and satin' },
      { value: 'B', label: 'Worn leather and woven cloth' },
      { value: 'C', label: 'Lace, crimson and torn edges' },
      { value: 'D', label: 'Sleek fabrics with glowing trim' },
    ],
  },
  {
    number: 4, key: 'q4', section: 'B', kind: 'single',
    prompt: 'What kind of haunting would you be?',
    options: [
      { value: 'A', label: 'An elegant mystery nobody solves' },
      { value: 'B', label: 'A wanderer guarding old secrets' },
      { value: 'C', label: 'A beautiful, restless phantom' },
      { value: 'D', label: 'A revenant rebuilt by the future' },
    ],
  },
  {
    number: 5, key: 'q5', section: 'B', kind: 'single',
    prompt: 'Which object would you keep in your pocket?',
    options: [
      { value: 'A', label: 'A mirror with a gold frame' },
      { value: 'B', label: 'A worn book of spells' },
      { value: 'C', label: 'A mask that hides half my face' },
      { value: 'D', label: 'A lantern with a living ember' },
    ],
  },
  {
    number: 6, key: 'q6', section: 'B', kind: 'single',
    prompt: 'How do you want the night to remember you?',
    options: [
      { value: 'A', label: 'Refined and impossible to forget' },
      { value: 'B', label: 'Wise and a little unsettling' },
      { value: 'C', label: 'Dramatic and darkly romantic' },
      { value: 'D', label: 'Bold, bright and ahead of its time' },
    ],
  },
  {
    number: 7, key: 'budget', section: 'C', kind: 'single', currencyAware: true,
    prompt: 'What is your budget for the costume?',
    options: [
      { value: 'lt20', label: 'Under 20' },
      { value: '20to50', label: '20 to 50' },
      { value: '50to100', label: '50 to 100' },
      { value: 'gt100', label: 'Over 100' },
    ],
  },
  {
    number: 8, key: 'time', section: 'C', kind: 'single',
    prompt: 'How much time can you spend preparing?',
    options: [
      { value: 'lt30m', label: 'Under 30 minutes' },
      { value: '30m2h', label: '30 minutes to 2 hours' },
      { value: '2to5h', label: '2 to 5 hours' },
      { value: 'gt5h', label: 'More than 5 hours' },
    ],
  },
  {
    number: 9, key: 'comfort', section: 'C', kind: 'single',
    prompt: 'How bold do you want the look to be?',
    options: [
      { value: 'simple', label: 'Simple', hint: 'Easy to wear and easy to move in' },
      { value: 'stylish', label: 'Stylish', hint: 'Polished with a clear theme' },
      { value: 'elaborate', label: 'Elaborate', hint: 'Layers, props and detail' },
      { value: 'experimental', label: 'Experimental', hint: 'Unusual and handmade' },
    ],
  },
  {
    number: 10, key: 'wardrobe', section: 'D', kind: 'multi',
    prompt: 'What do you already own? Choose all that apply.',
    options: [
      { value: 'black', label: 'Black clothing' },
      { value: 'white', label: 'White clothing' },
      { value: 'jackets', label: 'Jackets or coats' },
      { value: 'boots', label: 'Boots' },
      { value: 'dresses', label: 'Dresses or skirts' },
      { value: 'accessories', label: 'Jewellery or accessories' },
      { value: 'makeup', label: 'Makeup' },
      { value: 'themed', label: 'Themed items' },
      { value: 'other', label: 'Something else' },
      { value: 'scratch', label: 'Start from scratch', hint: 'Clears the other choices' },
    ],
  },
  {
    number: 11, key: 'event', section: 'D', kind: 'single',
    prompt: 'Where will the costume appear?',
    options: [
      { value: 'party', label: 'A Halloween party' },
      { value: 'photoshoot', label: 'A photoshoot' },
      { value: 'school', label: 'School or work' },
      { value: 'trick', label: 'Trick or treating' },
      { value: 'fun', label: 'Just for fun' },
    ],
  },
  {
    number: 12, key: 'playMode', section: 'D', kind: 'single',
    prompt: 'Who is dressing up?',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'couple', label: 'Me and a partner' },
      { value: 'group', label: 'A group' },
      { value: 'open', label: 'Open to anything' },
    ],
  },
]
