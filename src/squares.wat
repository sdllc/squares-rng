(module

  (func $sample (param $counter i64) (param $key i64) (result f64)

    (local $x i64) 
    (local $y i64) 
    (local $z i64) 
    (local $t i64) 

    ;; y = x = ctr * key;

    local.get $counter
    local.get $key
    i64.mul
    local.tee $x 
    local.tee $y

    ;; z = y + key;

    local.get $key
    i64.add
    local.set $z

    ;; --- round 1 -------------------------------------------------------------

    ;;  x = x * x + y;

    local.get $x
    local.get $x
    i64.mul
    local.get $y
    i64.add
    local.tee $x

    ;; x = (x >> 32) | (x << 32);
    
    (i64.rotr (i64.const 32))
    local.tee $x

    ;; --- round 2 -------------------------------------------------------------

    ;;  x = x * x + z;

    local.get $x
    i64.mul
    local.get $z
    i64.add
    local.tee $x

    ;;  x = (x >> 32) | (x << 32);

    (i64.rotr (i64.const 32))
    local.tee $x

    ;; --- round 3 -------------------------------------------------------------

    ;;  x = x * x + y;

    local.get $x
    i64.mul
    local.get $y
    i64.add
    local.tee $x

    ;; x = (x >> 32) | (x << 32);

    (i64.rotr (i64.const 32))
    local.tee $x

    ;; --- round 4 -------------------------------------------------------------

    ;;  t = x = x * x + z;

    local.get $x
    i64.mul
    local.get $z
    i64.add
    local.tee $x
    local.tee $t

    ;;  x = (x >> 32) | (x << 32);

    (i64.rotr (i64.const 32))
    local.tee $x

    ;; --- round 5 -------------------------------------------------------------

    ;;  return t ^ ((x * x + y) >> 32);

    local.get $x
    i64.mul
    local.get $y
    i64.add
    (i64.shr_u (i64.const 32))
    local.get $t
    i64.xor

    ;; --- here we're converting to a double in (0, 1) -------------------------

    (i64.shr_u (i64.const 12))
    (i64.or (i64.const 0x3ff0000000000000))

    f64.reinterpret_i64
    (f64.sub (f64.const 1.0))

  )

  (memory $memory 1)

  (func $sample_n (param $counter i64) (param $key i64) (param $n i32)

    (local $address i32)
    (local.set $address(i32.const 0))

    (loop $sample_loop (block $sample_loop_exit
    
      (i32.eq (i32.const 0) (local.get $n))
      br_if $sample_loop_exit

      local.get $address      
      (call $sample (local.get $counter) (local.get $key))
      f64.store
      
      (i32.add (i32.const 8) (local.get $address))
      local.set $address

      (i64.add (i64.const 1) (local.get $counter))
      local.set $counter

      (i32.sub (local.get $n) (i32.const 1))
      local.set $n
      
      br $sample_loop

    ))
  )

  (export "memory" (memory $memory))
  (export "sample" (func $sample))
  (export "sample_n" (func $sample_n))
  
)

