export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description: string;
  instructions: string[];
  tips: string[];
}

export const exerciseLibrary: Exercise[] = [
  // Chest
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    description: 'A compound exercise that primarily targets the chest muscles, along with the triceps and shoulders.',
    instructions: [
      'Lie flat on a bench with your feet firmly on the ground',
      'Grip the barbell slightly wider than shoulder-width apart',
      'Unrack the bar and lower it to your mid-chest',
      'Press the bar back up to the starting position',
    ],
    tips: [
      'Keep your shoulder blades pinched together',
      'Maintain a slight arch in your lower back',
      'Lower the bar in a controlled manner',
    ],
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    description: 'Targets the upper portion of the chest muscles with an inclined angle.',
    instructions: [
      'Set the bench to a 30-45 degree incline',
      'Lie back with feet flat on the ground',
      'Grip the barbell slightly wider than shoulder-width',
      'Lower to upper chest and press back up',
    ],
    tips: [
      'Keep your back flat against the bench',
      'Avoid flaring elbows too wide',
      'Focus on squeezing chest at the top',
    ],
  },
  {
    id: 'dumbbell-flyes',
    name: 'Dumbbell Flyes',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells',
    description: 'An isolation exercise that stretches and contracts the chest muscles.',
    instructions: [
      'Lie on a flat bench holding dumbbells above chest',
      'With a slight bend in elbows, lower arms out to sides',
      'Feel the stretch in your chest',
      'Bring the dumbbells back together above your chest',
    ],
    tips: [
      'Keep a slight bend in your elbows throughout',
      'Lower the weights slowly for better stretch',
      'Squeeze your chest at the top of the movement',
    ],
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
    description: 'A classic bodyweight exercise for chest, shoulders, and triceps.',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Keep your body in a straight line from head to heels',
      'Lower your chest towards the ground',
      'Push back up to the starting position',
    ],
    tips: [
      'Engage your core throughout',
      'Keep elbows at about 45 degrees from body',
      'Go full range of motion for best results',
    ],
  },

  // Back
  {
    id: 'deadlift',
    name: 'Deadlift',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    description: 'A compound exercise that works the entire posterior chain including back, glutes, and hamstrings.',
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot',
      'Bend at hips and knees to grip the bar',
      'Keep back flat, chest up, and drive through heels',
      'Stand up tall, then lower the bar back down',
    ],
    tips: [
      'Keep the bar close to your body',
      'Engage your lats before pulling',
      'Dont round your lower back',
    ],
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    description: 'A compound rowing movement that builds back thickness.',
    instructions: [
      'Bend at the hips with knees slightly bent',
      'Grip barbell slightly wider than shoulder-width',
      'Pull the bar to your lower chest',
      'Lower with control and repeat',
    ],
    tips: [
      'Keep your back flat throughout',
      'Squeeze your shoulder blades at the top',
      'Avoid using momentum',
    ],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    equipment: 'Cable Machine',
    description: 'A vertical pulling exercise that targets the latissimus dorsi.',
    instructions: [
      'Sit at the machine with thighs secured under pads',
      'Grip the bar wider than shoulder-width',
      'Pull the bar down to your upper chest',
      'Slowly return to the starting position',
    ],
    tips: [
      'Lead with your elbows',
      'Dont lean back too far',
      'Focus on squeezing your lats',
    ],
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    muscleGroup: 'Back',
    equipment: 'Pull-up Bar',
    description: 'A challenging bodyweight exercise for building back strength and width.',
    instructions: [
      'Hang from a bar with hands wider than shoulders',
      'Pull yourself up until chin is over the bar',
      'Lower yourself with control',
      'Repeat for desired reps',
    ],
    tips: [
      'Engage your core to prevent swinging',
      'Focus on driving elbows down',
      'Use full range of motion',
    ],
  },

  // Shoulders
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroup: 'Shoulders',
    equipment: 'Barbell',
    description: 'A compound pressing movement for shoulder development.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold barbell at shoulder height',
      'Press the bar overhead until arms are fully extended',
      'Lower back to shoulders with control',
    ],
    tips: [
      'Keep your core tight',
      'Dont lean back excessively',
      'Lock out at the top',
    ],
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    description: 'An isolation exercise targeting the lateral deltoids.',
    instructions: [
      'Stand with dumbbells at your sides',
      'Raise arms out to the sides until parallel to floor',
      'Keep a slight bend in elbows',
      'Lower slowly and repeat',
    ],
    tips: [
      'Lead with your elbows, not hands',
      'Avoid swinging the weights',
      'Use lighter weight for better control',
    ],
  },
  {
    id: 'face-pulls',
    name: 'Face Pulls',
    muscleGroup: 'Shoulders',
    equipment: 'Cable Machine',
    description: 'Targets rear deltoids and improves shoulder health.',
    instructions: [
      'Set cable at face height with rope attachment',
      'Pull the rope towards your face',
      'Separate the rope ends as you pull',
      'Squeeze rear delts and return slowly',
    ],
    tips: [
      'Keep elbows high',
      'Focus on external rotation',
      'Great for shoulder health and posture',
    ],
  },

  // Biceps
  {
    id: 'barbell-curl',
    name: 'Barbell Curl',
    muscleGroup: 'Biceps',
    equipment: 'Barbell',
    description: 'A classic bicep exercise for building arm size.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold barbell with underhand grip',
      'Curl the bar up towards shoulders',
      'Lower with control',
    ],
    tips: [
      'Keep elbows stationary at your sides',
      'Avoid swinging your body',
      'Squeeze biceps at the top',
    ],
  },
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbells',
    description: 'Allows for independent arm training and supination.',
    instructions: [
      'Stand holding dumbbells at your sides',
      'Curl one or both dumbbells up',
      'Rotate palms up as you curl',
      'Lower slowly and repeat',
    ],
    tips: [
      'Can be done alternating or together',
      'Focus on the squeeze at the top',
      'Control the negative',
    ],
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbells',
    description: 'Targets the brachialis and forearms along with biceps.',
    instructions: [
      'Hold dumbbells with neutral grip (palms facing each other)',
      'Curl up while keeping palms facing each other',
      'Squeeze at the top',
      'Lower with control',
    ],
    tips: [
      'Keep upper arms stationary',
      'Great for forearm development',
      'Can be done standing or seated',
    ],
  },

  // Triceps
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    muscleGroup: 'Triceps',
    equipment: 'Cable Machine',
    description: 'An isolation exercise for the triceps.',
    instructions: [
      'Stand facing cable machine with rope or bar attachment',
      'Keep elbows at your sides',
      'Push the handle down until arms are straight',
      'Return slowly to starting position',
    ],
    tips: [
      'Keep elbows pinned to your sides',
      'Squeeze triceps at the bottom',
      'Control the weight on the way up',
    ],
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    muscleGroup: 'Triceps',
    equipment: 'Barbell',
    description: 'A lying tricep extension for building mass.',
    instructions: [
      'Lie on bench holding barbell overhead',
      'Lower the bar towards your forehead',
      'Keep upper arms stationary',
      'Extend arms back to starting position',
    ],
    tips: [
      'Keep elbows pointing up, not out',
      'Use controlled movement',
      'Can also use dumbbells or EZ bar',
    ],
  },
  {
    id: 'dips',
    name: 'Dips',
    muscleGroup: 'Triceps',
    equipment: 'Dip Bars',
    description: 'A compound bodyweight exercise for triceps and chest.',
    instructions: [
      'Grip dip bars and lift yourself up',
      'Lower your body by bending elbows',
      'Go down until upper arms are parallel to floor',
      'Push back up to starting position',
    ],
    tips: [
      'Lean forward slightly for more chest',
      'Stay upright for more triceps',
      'Add weight when bodyweight becomes easy',
    ],
  },

  // Legs
  {
    id: 'squat',
    name: 'Squat',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    description: 'The king of leg exercises, targeting quads, glutes, and hamstrings.',
    instructions: [
      'Position barbell on upper back',
      'Stand with feet shoulder-width apart',
      'Descend by bending knees and hips',
      'Go down until thighs are parallel, then drive up',
    ],
    tips: [
      'Keep chest up and back straight',
      'Push knees out over toes',
      'Drive through your heels',
    ],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'Legs',
    equipment: 'Leg Press Machine',
    description: 'A machine-based compound leg exercise.',
    instructions: [
      'Sit in leg press machine with back flat',
      'Place feet shoulder-width apart on platform',
      'Lower the weight by bending knees',
      'Press back up without locking knees',
    ],
    tips: [
      'Dont lock knees at the top',
      'Keep lower back pressed against pad',
      'Foot placement affects muscle emphasis',
    ],
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    description: 'Targets the hamstrings and glutes with a hip hinge movement.',
    instructions: [
      'Stand holding barbell with overhand grip',
      'Push hips back while keeping legs nearly straight',
      'Lower bar along legs until you feel hamstring stretch',
      'Drive hips forward to return to standing',
    ],
    tips: [
      'Keep the bar close to your legs',
      'Maintain a flat back throughout',
      'Feel the stretch in your hamstrings',
    ],
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    muscleGroup: 'Legs',
    equipment: 'Leg Curl Machine',
    description: 'An isolation exercise for the hamstrings.',
    instructions: [
      'Lie face down on leg curl machine',
      'Position pad just above heels',
      'Curl your legs up towards glutes',
      'Lower with control',
    ],
    tips: [
      'Dont lift hips off the pad',
      'Squeeze hamstrings at the top',
      'Control the negative portion',
    ],
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    muscleGroup: 'Legs',
    equipment: 'Leg Extension Machine',
    description: 'An isolation exercise for the quadriceps.',
    instructions: [
      'Sit in machine with back against pad',
      'Position pad on lower shins',
      'Extend legs until straight',
      'Lower slowly with control',
    ],
    tips: [
      'Squeeze quads at the top',
      'Dont use momentum',
      'Great as a warm-up or finisher',
    ],
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    muscleGroup: 'Legs',
    equipment: 'Machine/Bodyweight',
    description: 'Targets the calf muscles for lower leg development.',
    instructions: [
      'Stand on edge of platform or step',
      'Lower heels below platform level',
      'Rise up onto toes as high as possible',
      'Lower back down with control',
    ],
    tips: [
      'Get full range of motion',
      'Pause at the top for better contraction',
      'Can be done seated or standing',
    ],
  },
  {
    id: 'lunges',
    name: 'Lunges',
    muscleGroup: 'Legs',
    equipment: 'Bodyweight/Dumbbells',
    description: 'A unilateral leg exercise for quads, glutes, and balance.',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower until both knees are at 90 degrees',
      'Push back to starting position',
    ],
    tips: [
      'Keep torso upright',
      'Dont let front knee go past toes',
      'Can be done walking or stationary',
    ],
  },

  // Core
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'An isometric core exercise for stability.',
    instructions: [
      'Get into push-up position on forearms',
      'Keep body in straight line from head to heels',
      'Engage core and hold position',
      'Maintain for desired duration',
    ],
    tips: [
      'Dont let hips sag or pike up',
      'Breathe steadily throughout',
      'Start with shorter holds and progress',
    ],
  },
  {
    id: 'crunches',
    name: 'Crunches',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    description: 'A basic abdominal exercise.',
    instructions: [
      'Lie on back with knees bent',
      'Place hands behind head or across chest',
      'Curl shoulders off the ground',
      'Lower back down with control',
    ],
    tips: [
      'Dont pull on your neck',
      'Focus on contracting abs',
      'Keep lower back on the ground',
    ],
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroup: 'Core',
    equipment: 'Pull-up Bar',
    description: 'An advanced core exercise targeting lower abs.',
    instructions: [
      'Hang from a pull-up bar',
      'Keep legs straight or slightly bent',
      'Raise legs until parallel to ground or higher',
      'Lower with control',
    ],
    tips: [
      'Avoid swinging',
      'Focus on using your abs to lift',
      'Can bend knees to make it easier',
    ],
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    muscleGroup: 'Core',
    equipment: 'Bodyweight/Medicine Ball',
    description: 'A rotational core exercise for obliques.',
    instructions: [
      'Sit with knees bent, feet off the ground',
      'Lean back slightly with straight back',
      'Rotate torso side to side',
      'Touch hands or weight to floor each side',
    ],
    tips: [
      'Keep core engaged throughout',
      'Move in controlled manner',
      'Add weight for more challenge',
    ],
  },

  // Full Body
  {
    id: 'burpees',
    name: 'Burpees',
    muscleGroup: 'Full Body',
    equipment: 'Bodyweight',
    description: 'A full-body conditioning exercise.',
    instructions: [
      'Start standing, then squat down',
      'Jump feet back to plank position',
      'Do a push-up (optional)',
      'Jump feet forward and jump up',
    ],
    tips: [
      'Move as quickly as possible',
      'Land softly when jumping',
      'Scale by removing push-up or jump',
    ],
  },
  {
    id: 'clean-and-press',
    name: 'Clean and Press',
    muscleGroup: 'Full Body',
    equipment: 'Barbell/Dumbbells',
    description: 'A compound movement combining a clean with an overhead press.',
    instructions: [
      'Start with weight on the floor',
      'Clean the weight to shoulders',
      'Press overhead',
      'Return to starting position',
    ],
    tips: [
      'Use hip power for the clean',
      'Keep core tight throughout',
      'Great for building power',
    ],
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    muscleGroup: 'Full Body',
    equipment: 'Kettlebell',
    description: 'A hip-hinge movement for power and conditioning.',
    instructions: [
      'Stand with feet wider than shoulder-width',
      'Hold kettlebell with both hands',
      'Hinge at hips and swing bell between legs',
      'Drive hips forward to swing bell to chest height',
    ],
    tips: [
      'Power comes from hips, not arms',
      'Keep core tight',
      'Squeeze glutes at the top',
    ],
  },
];
