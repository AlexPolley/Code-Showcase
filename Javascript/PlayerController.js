#pragma strict

public var thrustEffect:Transform;
public var fireControl:FireController;

@Header("Screen Settings")
public var screenWidth:float;
public var screenHeight:float;

@Header("Movement Settings")
public var forceValue:float;
public var torqueValue:float;
public var rigid:Rigidbody2D;

function FixedUpdate()
{
	// add directional force and rotational torque based on our input values
	rigid.AddForce((transform.up * forceValue) * Input.GetAxis("Vertical"));
	rigid.AddTorque(torqueValue * -Input.GetAxis("Horizontal"));
	
	// scale the thruster effect based on our vertical input
	thrustEffect.localScale = new Vector3(thrustEffect.localScale.x, Input.GetAxis("Vertical"), 1.0);
}
function Update () {
	// check for screen edges and "teleport" us.		
	if (transform.position.x >= screenWidth || transform.position.x <= -screenWidth) 
	{
		transform.position.x *= -1;	
	} 
	
	if (transform.position.y >= screenHeight || transform.position.y <= -screenHeight)
	{
		transform.position.y *= -1;	
	}
	
	// fire a bullet in our forward direction.
	if ( Input.GetButton("Fire1"))
	{
		fireControl.FireBullet();
	}
}