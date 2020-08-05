#pragma strict

public var forceValue:float;
public var destroyPosition:float = 5.5;

public var screenWidth:float;
public var screenHeight:float;

public var rigid:Rigidbody2D;

function OnEnable () {
	rigid = GetComponent.<Rigidbody2D>();
	rigid.AddForce(transform.up * forceValue);
}

function Update () {				
	if ( transform.position.y > screenHeight || transform.position.y < -screenHeight 
	|| transform.position.x > screenWidth || transform.position.x < -screenWidth)
	{
		gameObject.SetActive(false);
	}
}

function OnCollisionEnter2D(coll: Collision2D)
{
	gameObject.SetActive(false);
}