let space = new Pts.CanvasSpace('#points').setup({ retina: true, resize: true });
let form = space.getForm();
space.add( () => form.point( space.pointer, 10 ) );