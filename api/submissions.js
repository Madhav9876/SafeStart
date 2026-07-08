import supabase from './db-client.js';

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
}

async function requireUser(req) {
  const token = getBearerToken(req);
  if (!token) {
    return { user: null, response: { status: 401, body: { error: 'Authorization token required' } } };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { user: null, response: { status: 401, body: { error: 'Invalid or expired token' } } };
  }

  return { user, response: null };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      const { user, response } = await requireUser(req);
      if (response) return res.status(response.status).json(response.body);

      if (id) {
        const { data, error } = await supabase
          .from('quiz_submissions')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Submission not found' });
        return res.status(200).json(data);
      }

      const { data, error } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { user, response } = await requireUser(req);
      if (response) return res.status(response.status).json(response.body);

      const { product_type, answers, scores, overall_score, top_risks, maturity_label } = req.body;
      if (!product_type || !answers || typeof answers !== 'object') {
        return res.status(400).json({ error: 'product_type and answers are required' });
      }

      const insertData = {
        product_type,
        answers,
        user_id: user.id,
      };

      if (scores && Array.isArray(scores)) insertData.scores = scores;
      if (typeof overall_score === 'number') insertData.overall_score = overall_score;
      if (top_risks && Array.isArray(top_risks)) insertData.top_risks = top_risks;
      if (maturity_label) insertData.maturity_label = maturity_label;

      const { data, error } = await supabase
        .from('quiz_submissions')
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Submissions API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
