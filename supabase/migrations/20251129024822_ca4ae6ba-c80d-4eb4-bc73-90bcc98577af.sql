-- Recategorizar exercícios "outros" baseado em palavras-chave nos nomes
-- Esta migração atualiza os exercícios mal categorizados para suas categorias corretas

-- Panturrilhas -> pernas
UPDATE exercise_library 
SET muscle_group = 'pernas', subdivision = 'Panturrilhas'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%panturrilha%' 
  OR LOWER(name) LIKE '%gemeo%' 
  OR LOWER(name) LIKE '%gêmeo%'
  OR LOWER(name) LIKE '%calf%'
);

-- Ombros
UPDATE exercise_library 
SET muscle_group = 'ombros'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%elevacao frontal%' 
  OR LOWER(name) LIKE '%elevação frontal%'
  OR LOWER(name) LIKE '%desenvolvimento%'
  OR LOWER(name) LIKE '%overhead%'
  OR LOWER(name) LIKE '%deltoid%'
  OR LOWER(name) LIKE '%ombro%'
  OR LOWER(name) LIKE '%shoulder%'
);

-- Costas
UPDATE exercise_library 
SET muscle_group = 'costas'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%barra fixa%'
  OR LOWER(name) LIKE '%chin up%'
  OR LOWER(name) LIKE '%pullover%'
  OR LOWER(name) LIKE '%remada%'
  OR LOWER(name) LIKE '%puxada%'
  OR LOWER(name) LIKE '%pull%'
  OR LOWER(name) LIKE '%row%'
  OR LOWER(name) LIKE '%dorsal%'
);

-- Peito
UPDATE exercise_library 
SET muscle_group = 'peito'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%flexao de braco%'
  OR LOWER(name) LIKE '%flexão de braço%'
  OR LOWER(name) LIKE '%peck deck%'
  OR LOWER(name) LIKE '%supino%'
  OR LOWER(name) LIKE '%crucifixo%'
  OR LOWER(name) LIKE '%chest%'
  OR LOWER(name) LIKE '%peitoral%'
  OR LOWER(name) LIKE '%press%'
  OR LOWER(name) LIKE '%fly%'
);

-- Abdômen
UPDATE exercise_library 
SET muscle_group = 'abdomen'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%ab wheel%'
  OR LOWER(name) LIKE '%crunch%'
  OR LOWER(name) LIKE '%superman%'
  OR LOWER(name) LIKE '%prancha%'
  OR LOWER(name) LIKE '%plank%'
  OR LOWER(name) LIKE '%elevacao pernas%'
  OR LOWER(name) LIKE '%elevação pernas%'
  OR LOWER(name) LIKE '%torcao russa%'
  OR LOWER(name) LIKE '%torção russa%'
  OR LOWER(name) LIKE '%abdominal%'
  OR LOWER(name) LIKE '%obliquo%'
  OR LOWER(name) LIKE '%oblíquo%'
);

-- Pernas
UPDATE exercise_library 
SET muscle_group = 'pernas'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%agachamento%'
  OR LOWER(name) LIKE '%hack%'
  OR LOWER(name) LIKE '%leg press%'
  OR LOWER(name) LIKE '%afundo%'
  OR LOWER(name) LIKE '%extensora%'
  OR LOWER(name) LIKE '%stiff%'
  OR LOWER(name) LIKE '%terra%'
  OR LOWER(name) LIKE '%squat%'
  OR LOWER(name) LIKE '%deadlift%'
  OR LOWER(name) LIKE '%lunge%'
  OR LOWER(name) LIKE '%quadriceps%'
  OR LOWER(name) LIKE '%coxa%'
);

-- Glúteos
UPDATE exercise_library 
SET muscle_group = 'gluteos'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%coice%'
  OR LOWER(name) LIKE '%quadril%'
  OR LOWER(name) LIKE '%abducao%'
  OR LOWER(name) LIKE '%abdução%'
  OR LOWER(name) LIKE '%gluteo%'
  OR LOWER(name) LIKE '%glúteo%'
  OR LOWER(name) LIKE '%glute%'
  OR LOWER(name) LIKE '%hip thrust%'
  OR LOWER(name) LIKE '%elevacao pelvica%'
  OR LOWER(name) LIKE '%elevação pélvica%'
);

-- Bíceps
UPDATE exercise_library 
SET muscle_group = 'biceps'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%rosca%'
  OR LOWER(name) LIKE '%curl%'
  OR LOWER(name) LIKE '%bicep%'
  OR LOWER(name) LIKE '%bícep%'
);

-- Tríceps
UPDATE exercise_library 
SET muscle_group = 'triceps'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%tricep%'
  OR LOWER(name) LIKE '%trícep%'
  OR LOWER(name) LIKE '%paralelas%'
  OR LOWER(name) LIKE '%mergulho%'
  OR LOWER(name) LIKE '%frances%'
  OR LOWER(name) LIKE '%francês%'
  OR LOWER(name) LIKE '%testa%'
);

-- Cardio
UPDATE exercise_library 
SET muscle_group = 'cardio'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%corrida%'
  OR LOWER(name) LIKE '%bicicleta%'
  OR LOWER(name) LIKE '%escada%'
  OR LOWER(name) LIKE '%polichinelo%'
  OR LOWER(name) LIKE '%remo simulador%'
  OR LOWER(name) LIKE '%running%'
  OR LOWER(name) LIKE '%bike%'
  OR LOWER(name) LIKE '%cycling%'
);

-- Adutores
UPDATE exercise_library 
SET muscle_group = 'adutores'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%aduc%'
  OR LOWER(name) LIKE '%aduç%'
  OR LOWER(name) LIKE '%adduction%'
);

-- Antebraço
UPDATE exercise_library 
SET muscle_group = 'antebraco'
WHERE muscle_group = 'outros' 
AND (
  LOWER(name) LIKE '%antebraco%'
  OR LOWER(name) LIKE '%antebraço%'
  OR LOWER(name) LIKE '%punho%'
  OR LOWER(name) LIKE '%wrist%'
  OR LOWER(name) LIKE '%forearm%'
);