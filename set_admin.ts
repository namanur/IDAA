import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setAdmin(email: string, password?: string) {
  console.log(`Processing admin role for: ${email}`);

  // 1. Get the user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  let user = users.find(u => u.email === email);

  // If user doesn't exist, create it
  if (!user) {
    console.log(`User not found. Creating user: ${email}`);
    if (!password) {
      console.error('Error: Password is required when creating a new user.');
      process.exit(1);
    }
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Admin' }
    });
    if (createError) throw createError;
    user = newUser;
  } else {
    // 2. Update existing user's role to 'admin'
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (profileError) throw profileError;

    // 3. (Optional) Force verify the email
    const updateData: any = { email_confirm: true };
    if (password) {
      updateData.password = password;
      console.log('Updating password...');
    }

    const { error: verifyError } = await supabase.auth.admin.updateUserById(
      user.id,
      updateData
    );

    if (verifyError) throw verifyError;
  }

  console.log(`Successfully configured ${email} as admin.`);
  if (password) console.log('Password has been set/updated.');
}

const targetEmail = process.argv[2];
const targetPassword = process.argv[3];

if (!targetEmail) {
  console.log('Usage: bun run admin:set <email> [password]');
  process.exit(1);
}

setAdmin(targetEmail, targetPassword).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
