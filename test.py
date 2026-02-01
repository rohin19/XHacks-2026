from supabase import create_client

url = "https://uvwyfxkxgkwweehpfxfn.supabase.co/"
key = "sb_secret_J-vPhYSqW9jvCtzPb66Rhw_bvVeGr1h"

supabase = create_client(url, key)

r = supabase.table("places").select("*").execute()
print(r.data)