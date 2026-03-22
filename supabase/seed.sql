insert into public.honestly_user_profiles (id, email, full_name, role, auth_provider, avatar_url)
values
  ('11111111-1111-1111-1111-111111111111', 'avery@example.com', 'Avery Johnson', 'user', 'google', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
  ('22222222-2222-2222-2222-222222222222', 'admin@example.com', 'Admin User', 'admin', 'password', null)
on conflict (email) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  auth_provider = excluded.auth_provider,
  avatar_url = excluded.avatar_url,
  updated_at = now();

insert into public.honestly_categories (id, slug, name, description, featured_on_home, home_order, promoted_subcategories)
values
  ('10000000-0000-0000-0000-000000000001', 'venues', 'Venues', 'Character-filled venues for intimate and large events.', true, 1, array['Garden Venues']),
  ('10000000-0000-0000-0000-000000000002', 'floral-design', 'Floral Design', 'Modern and sculptural floral design studios.', true, 2, array['Wedding Florals']),
  ('10000000-0000-0000-0000-000000000003', 'photography', 'Photography', 'Photographers for weddings, portraits, and editorial campaigns.', true, 3, array['Editorial','Fine Art Film'])
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  featured_on_home = excluded.featured_on_home,
  home_order = excluded.home_order,
  promoted_subcategories = excluded.promoted_subcategories,
  updated_at = now();

insert into public.honestly_subcategories (id, category_id, slug, name)
values
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'fine-art-film', 'Fine Art Film'),
  ('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'editorial', 'Editorial'),
  ('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'documentary', 'Documentary'),
  ('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'modernist', 'Modernist'),
  ('11000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'black-and-white', 'Black & White'),
  ('11000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'garden-venues', 'Garden Venues'),
  ('11000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'industrial-venues', 'Industrial Venues'),
  ('11000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'wedding-florals', 'Wedding Florals'),
  ('11000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'editorial-florals', 'Editorial Florals')
on conflict (category_id, slug) do update set
  name = excluded.name,
  updated_at = now();

insert into public.honestly_rating_criteria (id, name, description, active, position)
values
  ('12000000-0000-0000-0000-000000000001', 'Communication', 'How responsive and clear was the vendor during the process?', true, 1),
  ('12000000-0000-0000-0000-000000000002', 'Quality of Work', 'The aesthetic finish, durability, and craftsmanship of the final result.', true, 2),
  ('12000000-0000-0000-0000-000000000003', 'Professionalism', 'General conduct and punctuality.', false, 3)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  active = excluded.active,
  position = excluded.position,
  updated_at = now();

insert into public.honestly_vendors (
  id, slug, name, headline, description, verified, claimed, status, rating_avg, review_count, price_tier, primary_category_id, travels, service_radius_km, owner_user_id
)
values
  ('13000000-0000-0000-0000-000000000001', 'wildflower-archive', 'Wildflower Archive', 'Ethereal arrangements for modern romantics.', 'Wildflower Archive crafts expressive floral stories with a fine-art approach.', true, true, 'active', 4.90, 124, '$$$', '10000000-0000-0000-0000-000000000002', true, 300, '11111111-1111-1111-1111-111111111111'),
  ('13000000-0000-0000-0000-000000000002', 'the-wild-rose-studio', 'The Wild Rose Studio', 'Fine art botanical sculptures...', 'The Wild Rose Studio creates sculptural floral installations with seasonal stems.', true, true, 'active', 4.92, 88, '$$$', '10000000-0000-0000-0000-000000000002', true, 220, '11111111-1111-1111-1111-111111111111'),
  ('13000000-0000-0000-0000-000000000003', 'estate-at-silver-lake', 'Estate at Silver Lake', 'A historic manor on 40 acres...', 'Estate at Silver Lake is a private venue for elevated weddings and events.', true, true, 'active', 4.85, 73, '$$$', '10000000-0000-0000-0000-000000000001', false, 0, null),
  ('13000000-0000-0000-0000-000000000004', 'golden-hour-stills', 'Golden Hour Stills', 'Capturing the quiet moments in between.', 'Golden Hour Stills documents celebrations with cinematic warmth and emotional framing.', true, false, 'active', 5.00, 29, '$$', '10000000-0000-0000-0000-000000000003', true, 250, null),
  ('13000000-0000-0000-0000-000000000005', 'the-film-archive', 'The Film Archive', 'Thoughtful, grain-heavy imagery that feels like a forgotten memory.', 'The Film Archive specializes in analogue-forward photography with timeless editorial composition.', true, true, 'active', 4.90, 42, '$$$', '10000000-0000-0000-0000-000000000003', true, null, null),
  ('13000000-0000-0000-0000-000000000006', 'the-glass-house', 'The Glass House', 'A minimalist sanctuary in the high desert.', 'The Glass House is a design-led venue for modern intimate gatherings.', false, false, 'active', 4.80, 17, '$$$', '10000000-0000-0000-0000-000000000001', false, 0, null)
on conflict (slug) do update set
  name = excluded.name,
  headline = excluded.headline,
  description = excluded.description,
  verified = excluded.verified,
  claimed = excluded.claimed,
  status = excluded.status,
  rating_avg = excluded.rating_avg,
  review_count = excluded.review_count,
  price_tier = excluded.price_tier,
  primary_category_id = excluded.primary_category_id,
  travels = excluded.travels,
  service_radius_km = excluded.service_radius_km,
  owner_user_id = excluded.owner_user_id,
  updated_at = now();

insert into public.honestly_vendor_category_links (vendor_id, category_id)
values
  ('13000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
  ('13000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
  ('13000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
  ('13000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003'),
  ('13000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003'),
  ('13000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into public.honestly_vendor_subcategory_links (vendor_id, subcategory_id)
values
  ('13000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000008'),
  ('13000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000008'),
  ('13000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000006'),
  ('13000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000002'),
  ('13000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000001'),
  ('13000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006')
on conflict do nothing;

insert into public.honestly_vendor_locations (id, vendor_id, city, region, country, is_primary)
values
  ('14000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', 'Hudson Valley', 'NY', 'USA', true),
  ('14000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000001', 'Brooklyn', 'NY', 'USA', false),
  ('14000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000002', 'Hudson Valley', 'NY', 'USA', true),
  ('14000000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000003', 'Catskills', 'NY', 'USA', true),
  ('14000000-0000-0000-0000-000000000005', '13000000-0000-0000-0000-000000000004', 'Austin', 'TX', 'USA', true),
  ('14000000-0000-0000-0000-000000000006', '13000000-0000-0000-0000-000000000005', 'London', null, 'UK', true),
  ('14000000-0000-0000-0000-000000000007', '13000000-0000-0000-0000-000000000006', 'Joshua Tree', 'CA', 'USA', true)
on conflict (id) do nothing;

insert into public.honestly_vendor_images (id, vendor_id, url, alt, kind, position)
values
  ('15000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1200', 'Floral arrangement', 'cover', 0),
  ('15000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', 'Wedding table setup', 'gallery', 1),
  ('15000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1517722014278-c256a911678b?auto=format&fit=crop&q=80&w=600', 'Wedding bouquet', 'gallery', 2),
  ('15000000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600', 'Seasonal flowers', 'gallery', 3),
  ('15000000-0000-0000-0000-000000000005', '13000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', 'Floral studio wedding setup', 'cover', 0),
  ('15000000-0000-0000-0000-000000000006', '13000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', 'Historic manor venue', 'cover', 0),
  ('15000000-0000-0000-0000-000000000007', '13000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800', 'Wedding photography', 'cover', 0),
  ('15000000-0000-0000-0000-000000000008', '13000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1492691523567-61709d1aa3b0?auto=format&fit=crop&q=80&w=800', 'Film photography portrait', 'cover', 0),
  ('15000000-0000-0000-0000-000000000009', '13000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800', 'Venue in desert', 'cover', 0)
on conflict (id) do nothing;

insert into public.honestly_vendor_socials (id, vendor_id, platform, url)
values
  ('16000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', 'instagram', 'https://instagram.com'),
  ('16000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000001', 'website', 'https://example.com'),
  ('16000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000002', 'instagram', 'https://instagram.com'),
  ('16000000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000003', 'website', 'https://example.com'),
  ('16000000-0000-0000-0000-000000000005', '13000000-0000-0000-0000-000000000004', 'instagram', 'https://instagram.com'),
  ('16000000-0000-0000-0000-000000000006', '13000000-0000-0000-0000-000000000005', 'instagram', 'https://instagram.com'),
  ('16000000-0000-0000-0000-000000000007', '13000000-0000-0000-0000-000000000006', 'website', 'https://example.com')
on conflict (id) do nothing;

insert into public.honestly_reviews (id, vendor_id, user_id, overall_rating, title, body, status, created_at, updated_at)
values
  ('17000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 5.00, 'The highlight of our wedding day', 'Elena brought our vision to life in a way I could not have imagined. The textures and the scent of the local peonies were breathtaking. Worth every penny.', 'approved', '2025-10-12T10:22:00.000Z', '2025-10-12T10:22:00.000Z'),
  ('17000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 4.00, 'Sublime light and quiet professionalism', 'Our photographer was a dream to work with. We are just waiting for the final gallery, but the sneak peeks are gorgeous.', 'pending', '2026-03-04T15:00:00.000Z', '2026-03-04T15:00:00.000Z'),
  ('17000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 3.00, 'Needs one more edit', 'This venue had beautiful light and a strong point of view, but I included contact details that need to be removed before resubmitting.', 'rejected', '2025-08-14T09:00:00.000Z', '2025-08-14T09:00:00.000Z')
on conflict (id) do update set
  overall_rating = excluded.overall_rating,
  title = excluded.title,
  body = excluded.body,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.honestly_review_ratings (review_id, criterion_id, score)
values
  ('17000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 5.00),
  ('17000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000002', 5.00),
  ('17000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', 4.00),
  ('17000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000002', 5.00),
  ('17000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000001', 3.00),
  ('17000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000002', 4.00)
on conflict (review_id, criterion_id) do update set
  score = excluded.score;

insert into public.honestly_saved_lists (id, user_id, name, description, is_public, share_slug)
values
  ('18000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Summer Wedding 2026', 'Ceremony and reception vendor shortlist', false, null),
  ('18000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Living Room Refresh', 'Styling references and interior vendors', true, 'living-room-refresh')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  is_public = excluded.is_public,
  share_slug = excluded.share_slug,
  updated_at = now();

insert into public.honestly_saved_list_items (list_id, vendor_id, created_at)
values
  ('18000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', '2026-02-20T09:00:00.000Z'),
  ('18000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000004', '2026-02-22T12:30:00.000Z'),
  ('18000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000006', '2026-02-23T14:30:00.000Z'),
  ('18000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000006', '2026-02-20T09:00:00.000Z'),
  ('18000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000004', '2026-02-22T12:30:00.000Z')
on conflict (list_id, vendor_id) do update set
  created_at = excluded.created_at;

insert into public.honestly_vendor_claims (
  id, vendor_id, user_id, claimant_name, verification_email, verification_instagram, verification_tiktok, status, note, created_at
)
values
  ('19000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Elena Vance', 'elena@wildflowerarchive.com', '@wildflower', 'wildflower_stills', 'pending', 'I am the lead designer and co-founder. You can verify my work via our website portfolio and the business email provided above.', '2026-02-28T09:45:00.000Z'),
  ('19000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Avery Johnson', null, '@glasshouseevents', null, 'rejected', 'Previous request sent from a personal inbox without brand verification.', '2025-08-14T09:45:00.000Z'),
  ('19000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Morgan Lee', 'team@silverlakedomain.com', null, null, 'approved', 'Verified through business email and Instagram.', '2025-11-02T11:15:00.000Z')
on conflict (id) do update set
  claimant_name = excluded.claimant_name,
  verification_email = excluded.verification_email,
  verification_instagram = excluded.verification_instagram,
  verification_tiktok = excluded.verification_tiktok,
  status = excluded.status,
  note = excluded.note,
  updated_at = now();
