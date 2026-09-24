-- Allow a traveler to insert/read a voucher for their own booking (needed so
-- self-checkout can auto-generate a voucher immediately after payment,
-- without requiring staff to do it manually).
create policy "vouchers_own_insert" on public.vouchers for insert
  with check (
    exists (select 1 from public.bookings b where b.id = booking_id and b.contact_email = auth.jwt() ->> 'email')
  );

create policy "vouchers_own_read" on public.vouchers for select
  using (
    exists (select 1 from public.bookings b where b.id = booking_id and b.contact_email = auth.jwt() ->> 'email')
  );
