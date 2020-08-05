#pragma strict

public var playerTarget:Transform;
public var distanceToPlayer:float;
public var awarenessRadius:float;
public var fireControl:FireController;

@Header("Movement Settings")
public var randomDirection:int;
public var movementSpeed:float;
public var newDirectionWaitTime:float;
public var startingWaitValue:float;

@Header("Screen Settings")
public var screenWidth:float;
public var screenHeight:float;

function Start () {	
	// find the player object in the scene and access its transform.
	playerTarget = GameObject.FindGameObjectWithTag("Player").transform;
	
	// select a random direction
	// using ints with random.range means the max value is non-inclusive.
	// so we'll only get up to 359 here.
	randomDirection = Random.Range(0, 360);
	
	// add a bit of randomness to our initial new direction wait time
	startingWaitValue = newDirectionWaitTime;
	newDirectionWaitTime = Random.Range(0.0f, newDirectionWaitTime);
	
	// set the selectnewdirection coroutine running
	SelectNewDirection();
}

function SelectNewDirection()
{
	// start an infinite loop
	while(true)
	{
		// so every x seconds
		yield WaitForSeconds(newDirectionWaitTime);
		
		newDirectionWaitTime = startingWaitValue;
		
		// we pick a new direction
		randomDirection = Random.Range(0, 360);
	}
}

function Update () {	
	// use some trigonometry to move the ufo based on our random direction
	// the Cosine of the angle gives us our x direction
	// the Sine of the angle gives us the y.
	transform.position.x += Mathf.Cos(randomDirection) * movementSpeed * Time.deltaTime;
	transform.position.y += Mathf.Sin(randomDirection) * movementSpeed * Time.deltaTime;	
	
	// find the distance to the player
	distanceToPlayer = Vector3.Distance(transform.position, playerTarget.position);
	
	// if that is less than our awareness radius
	if ( distanceToPlayer <= awarenessRadius )
	{
		// find the angle between us and the player
		var vectorToPlayer:Vector3 = playerTarget.position - transform.position;
		var angle:float = Mathf.Atan2(vectorToPlayer.y, vectorToPlayer.x) * Mathf.Rad2Deg;
		var quat:Quaternion = Quaternion.AngleAxis(angle-90, Vector3.forward);
		// and fire a bullet in that direction.
		fireControl.FireBullet(quat);
	}
	
	// screen edge checks
	if (transform.position.x >= screenWidth || transform.position.x <= -screenWidth) 
	{
		transform.position.x *= -1;	
	} 
	
	if (transform.position.y >= screenHeight || transform.position.y <= -screenHeight)
	{
		transform.position.y *= -1;	
	}
}