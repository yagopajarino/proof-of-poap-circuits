fn is_element_in_set(element: Field, set: [Field; 50]) -> bool {
    let mut result: bool = false;
    for i in 0..set.len() {
        if (element == set[i]) {
            result = true;
        }
    }
    result
}

fn main(element: Field, set: [Field; 50]) {
    let ckeckInclusion = is_element_in_set(element, set);

    assert(ckeckInclusion);
}

#[test]
fn test_main() {
    let element = 1;
    let set = [
        1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    main(element, set);
}
