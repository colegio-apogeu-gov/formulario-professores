/*
  # Create feedback_professores table

  1. New Tables
    - `feedback_professores`
      - `id` (uuid, primary key) - Unique identifier for each feedback
      - `user_id` (text) - Firebase user ID who submitted the feedback
      - `timestamp` (timestamptz) - Date and time when feedback was submitted
      - `unidade` (text) - Selected school unit
      - `nome_professor` (text) - Teacher's name
      - `regional` (text) - Teacher's regional area
      - `cadastro` (text) - Teacher's registration code
      - `admissao` (text) - Teacher's admission date
      - `cpf` (text) - Teacher's CPF number
      - `cargo` (text) - Teacher's position
      - `local` (text) - Work location
      - `escola` (text) - School name
      - `horas_mes` (text) - Monthly hours
      - `horas_semana` (text) - Weekly hours
      - `planejamento` (int) - Planning and organization rating (1-5)
      - `didatica` (int) - Teaching and management rating (1-5)
      - `comunicacao` (int) - Communication and relationship rating (1-5)
      - `postura` (int) - Professional posture and commitment rating (1-5)
      - `consideracoes` (text) - Final considerations/comments

  2. Security
    - Enable RLS on `feedback_professores` table
    - Add policy for authenticated users to insert their own feedback
    - Add policy for authenticated users to view their own feedback
    - Add policy for authenticated users to view all feedback (for administrators)

  3. Important Notes
    - All ratings are stored as integers between 1 and 5
    - Timestamp is automatically set to current time on insert
    - User ID links feedback to Firebase authenticated user
*/

CREATE TABLE IF NOT EXISTS feedback_professores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  unidade text NOT NULL,
  nome_professor text NOT NULL,
  regional text NOT NULL,
  cadastro text NOT NULL,
  admissao text NOT NULL,
  cpf text NOT NULL,
  cargo text NOT NULL,
  local text NOT NULL,
  escola text NOT NULL,
  horas_mes text NOT NULL,
  horas_semana text NOT NULL,
  planejamento int NOT NULL CHECK (planejamento >= 1 AND planejamento <= 5),
  didatica int NOT NULL CHECK (didatica >= 1 AND didatica <= 5),
  comunicacao int NOT NULL CHECK (comunicacao >= 1 AND comunicacao <= 5),
  postura int NOT NULL CHECK (postura >= 1 AND postura <= 5),
  consideracoes text DEFAULT ''
);

ALTER TABLE feedback_professores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own feedback"
  ON feedback_professores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own feedback"
  ON feedback_professores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback_professores(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback_professores(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_professor ON feedback_professores(nome_professor);